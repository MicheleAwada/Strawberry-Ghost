import { API_URL } from '../../config';

const Checkout = () => {
    return (
        <>
            <div className="container">
                <h1>Checkout</h1>
                <img src="https://i.imgur.com/EHyR2nP.png" className='image'></img>
                <h2>Price</h2>
                <h3>25$</h3>
                <form action={`${API_URL}/checkout/create-checkout-session/`} method="POST">
                    <input type="hidden" name="variant_id" value={6} />
                    <input type="hidden" name="quantity" value={10} />
                    <button className="btn-checkout" type="submit" >Checkout</button>
                </form>
            </div>
        </>
    );
}

export default Checkout;