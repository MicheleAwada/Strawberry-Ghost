from django.shortcuts import redirect
from rest_framework.views import APIView
import stripe
from django.conf import settings
from django.http import JsonResponse
from django.http import HttpResponse
from rest_framework.response import Response
from django.utils.text import Truncator
import json
from django.shortcuts import get_object_or_404
from django.apps import apps
from rest_framework import permissions
from django.db.models import F, Q
from django.views.decorators.csrf import csrf_exempt

Variant = apps.get_model('products', 'Variant')
OrderItem = apps.get_model('products', 'OrderItem')
OrderProductItem = apps.get_model('products', 'OrderProductItem')

stripe.api_key = settings.STRIPE_SECRET_KEY
webhook_secret = settings.STRIPE_WEBHOOK_SECRET

class WebHook(APIView):
  @csrf_exempt
  def post(self, request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    event = None

    try:
      event = stripe.Webhook.construct_event(
        payload, sig_header, webhook_secret
      )
    except:
      # Invalid payload
      return HttpResponse(status=400)

    # Handle the event
    if event.type == 'payment_intent.created': # user is getting ready to pay
      payment_intent = event.data.object  # contains a stripe.PaymentIntent
    elif event.type == 'payment_intent.succeeded': # user payed
      payment_intent = event.data.object  # contains a stripe.PaymentIntent
      order_id = payment_intent.metadata.order_id
      order = OrderItem.objects.get(id=order_id)
      order.money_paid(info=json.loads(str(payment_intent)))
      for orderitem in order.order_product_items.all():
        variant = orderitem.variant
        variant.stock -= orderitem.quantity
        variant.save()
    elif event.type == 'payment_method.attached':
      payment_method = event.data.object  # contains a stripe.PaymentMethod
      print('PaymentMethod was attached to a Customer!')
    # ... handle other event types
    else:
      print('Unhandled event type {}'.format(event.type))
    print('FINALLY event type {}'.format(event.type))
    return HttpResponse(status=200)

class CreatePaymentIntent(APIView):
  permission_classes = [permissions.IsAuthenticated]
  def post(self, request):
    try:
      data = request.data
      is_cart_checkout = data.get("is_cart_checkout", False)
      order_id = None
      modified_changed = False
      if is_cart_checkout:
        old_user_cart = request.user.cartitem_set.filter(saveForLater=False)
        # check for invalid cartItems
        query = Q(quantity__lte=0) | Q(variant__stock__lt=F("quantity"))
        user_cart_to_be_deleted = old_user_cart.filter(query)
        modified_changed = len(user_cart_to_be_deleted) > 0
        user_cart_to_be_deleted.delete()
        # get the new undeleted/safe cartitems
        user_cart = request.user.cartitem_set.filter(saveForLater=False)
        if len(user_cart) <= 0: return Response({"detail": "Cart is empty"}, status=400)
        order = OrderItem.objects.create(user=request.user)
        order_id = order.id
        for cartItem in user_cart:
          orderproductitem = OrderProductItem.objects.create(order=order, variant=cartItem.variant, product=cartItem.product, quantity=cartItem.quantity)
      else:
        variant_id = data.get("variant_id")
        quantity = data.get("quantity")
        quantity = int(quantity)
        if quantity <= 0: return Response({"detail": "Quantity must be greater than 0"}, status=400)
        variant = get_object_or_404(Variant, pk=variant_id)
        if variant.stock < quantity: return Response({"detail": "not enough stock"}, status=400)
        # totalCost = variant.product.price * quantity
        order = OrderItem.objects.create(user=request.user)
        order_id = order.id
        orderproductitem = OrderProductItem.objects.create(order=order, variant=variant, product=variant.product, quantity=quantity)
      totalCost = int(order.total_cost()*100)
      intent = stripe.PaymentIntent.create(
        amount=totalCost,
        currency='eur',
        metadata={
          'order_id': order_id,
        },
        # In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods={
          'enabled': True,
        },
      )

      return JsonResponse({"clientSecret": intent['client_secret'], "cost": totalCost/100, "modified_changed": modified_changed }, status=200)
    except Exception as e:
      print(e)
      return JsonResponse({"detail": str(e)}, status=403)



# FRONTEND_CHECKOUT_SUCCESS_URL = settings.FRONTEND_CHECKOUT_SUCCESS_URL
# FRONTEND_CHECKOUT_FAILED_URL = settings.FRONTEND_CHECKOUT_FAILED_URL

# class CreateCheckoutSession(APIView):
#   def post(self, request):
    # def get_item(variant, quantity):
    #   product = variant.product
    #   return {
    #     'price_data': {
    #       'currency': 'eur',
    #       'product_data': {
    #         'name': (product.title + ", " + variant.name),
    #         'description': (product.description),
    #       },
    #       'unit_amount': int(int(product.price) * 100)
    #     },
    #     'quantity': quantity
    #   }
    # data = request.data
    # is_cart_checkout = data.get('is_cart_checkout', False)
    # quantity = data.get('quantity')
    # variant_id = data.get('variant_id')
    #
    # if not request.user.is_authenticated:
    #   return HttpResponse("Not authenticated", status=400)
    #
    # if not is_cart_checkout:
    #   if variant_id is None or quantity is None:
    #     return HttpResponse("Missing variant id", status=400)
    #   variant = Variant.objects.get(id=variant_id)
    #   if variant.stock<=0: raise HttpResponse({"detail": "Variant out of stock"}, status=400)
    #   product = variant.product
    #   line_items = [
    #     get_item(variant, quantity)
    #   ]
    # else:
    #   user_cart = request.user.cartitem_set.filter(saveForLater=False)
    #   user_cart.filter(variant__stock__lte=0).delete()
    #   user_cart = request.user.cartitem_set.filter(saveForLater=False)
    #   line_items = list(map(lambda cart_item: get_item(cart_item.variant, cart_item.quantity), user_cart))
    #
    #
    #
    # try:
    #   checkout_session = stripe.checkout.Session.create(
    #     line_items = line_items,
    #     mode= 'payment',
    #     billing_address_collection='required',
    #     customer_email= request.user.email,
    #     success_url= FRONTEND_CHECKOUT_SUCCESS_URL,
    #     cancel_url= FRONTEND_CHECKOUT_FAILED_URL,
    #     )
    #   print("THE CHECKOAUt SESSION IS", checkout_session)
    #   return Response({"link": checkout_session.url}, status=200)
    # except Exception as e:
    #
    #
    #
    #     return HttpResponse(f"An error occurred: {e}", status=500)