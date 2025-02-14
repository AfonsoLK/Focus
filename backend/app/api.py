from ninja import NinjaAPI
from utils.decorators import docs
from core.api import router as core_router
from lib.scalar import Scalar
import orjson
from ninja.renderers import BaseRenderer

class ORJSONRenderer(BaseRenderer):
    media_type = "application/json"
    
    def render(self, request, data, *, response_status):
        return orjson.dumps(data, default=str)


class API(NinjaAPI):
    def get_openapi_operation_id(self, operation) -> str:
        name =  operation.view_func.__name__
        return name.replace("_", "-")
    
api = API(description="API de tarefas", urls_namespace="api", docs= Scalar(), docs_decorator=docs())

api.add_router("/", core_router, tags=["Tarefas"])