import json
from typing import TYPE_CHECKING, Any

from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from ninja import NinjaAPI
from ninja.openapi.docs import DocsBase

if TYPE_CHECKING:  # pragma: no cover
    from ninja import NinjaAPI


class Scalar(DocsBase):
    template = "scalar.html"
    settings = {
        "theme": "saturn",
        "layout": "modern",
        "hideModels": True,
        "metaData": {
            "title": "API",
        },
        "favicon": "https://scalar.com/favicon.svg",
    }

    def render_page(
        self, request: HttpRequest, api: "NinjaAPI", **kwargs: Any
    ) -> HttpResponse:
        if api_key := request.COOKIES.get("api-key"):
            self.settings["authentication"] = {
                "preferredSecurityScheme": "Auth",
                "apiKey": {
                    "token": api_key,
                },
            }

        context = {
            "api": api,
            "url": self.get_openapi_url(api, kwargs),
            "settings": json.dumps(self.settings),
        }
        return render(request, self.template, context)