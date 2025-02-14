from functools import wraps
from django.core.cache import cache
from django.conf import settings


def docs():
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            if request.path != "/api/openapi.json" or settings.DEBUG:
                return func(request, *args, **kwargs)

            cache_key = f"openapi:{settings.VERSION}"

            cached_response = cache.get(cache_key)
            if cached_response is not None:
                return cached_response

            response = func(request, *args, **kwargs)
            cache.set(cache_key, response, timeout=None)
            return response

        return wrapper

    return decorator