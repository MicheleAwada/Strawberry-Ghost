def is_valid_rating(rating, errorToRaise=ValueError, raise_exception=True):
    if rating < 0.5 or rating > 5:
        if raise_exception: raise errorToRaise("Rating must be between 0.5 and 5")
        return False
    if int(rating*2) != rating*2:
        if raise_exception: raise errorToRaise("Rating must be an integer or with half")
        return False
    if raise_exception:
        return rating
    return True