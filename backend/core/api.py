from ninja import NinjaAPI
from pydantic import BaseModel
from django.shortcuts import get_object_or_404
from .models import Task, Tag
from scalar_django_ninja import ScalarViewer

api = NinjaAPI(docs=ScalarViewer(), docs_url='/docs/')

class TagSchema(BaseModel):
    nome: str
    
class TaskSchema(BaseModel):
    titulo: str
    descricao: str | None
    tags: list[int] 

@api.get("/tasks/", response=list[TaskSchema])
def listar_tasks(request):
    tasks = Task.objects.prefetch_related("tags").all()
    return [
        {
            "titulo": t.titulo,
            "descricao": t.descricao,
            "tags": [tag.id for tag in t.tags.all()]
        }
        for t in tasks
    ]

@api.get("/tags/", response=list[TagSchema])
def listar_tags(request):
    tags = Tag.objects.all()
    return [{"nome": tag.nome} for tag in tags]

@api.post("/tasks/", response=TaskSchema)
def criar_task(request, data: TaskSchema):
    tags = Tag.objects.filter(id__in=data.tags)
    task = Task.objects.create(titulo=data.titulo, descricao=data.descricao)
    task.tags.set(tags)
    return {
        "titulo": task.titulo,
        "descricao": task.descricao,
        "tags": [tag.id for tag in task.tags.all()],
    }

@api.post("/tags/", response=TagSchema)
def criar_tag(request, data: TagSchema):
    tag = Tag.objects.create(nome=data.nome)
    return {"nome": tag.nome}

@api.put("/tasks/{task_id}/", response=TaskSchema)
def atualizar_task(request, task_id: int, data: TaskSchema):
    task = get_object_or_404(Task, id=task_id)
    tags = Tag.objects.filter(id__in=data.tags)
    task.titulo = data.titulo
    task.descricao = data.descricao
    task.tags.set(tags)
    task.save()
    return {
        "titulo": task.titulo,
        "descricao": task.descricao,
        "tags": [tag.id for tag in task.tags.all()],
    }

@api.delete("/tasks/{task_id}/")
def deletar_task(request, task_id: int):
    task = get_object_or_404(Task, id=task_id)
    task.delete()
    return {"success": True}

@api.delete("/tags/{tag_id}/")
def deletar_tag(request, tag_id: int):
    tag = get_object_or_404(Tag, id=tag_id)
    tag.delete()
    return {"success": True}
