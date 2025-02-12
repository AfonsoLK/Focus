from ninja import NinjaAPI, Router
from pydantic import BaseModel
from django.shortcuts import get_object_or_404
from .models import Task, Tag
from scalar_django_ninja import ScalarViewer
from typing import List
from django.http import JsonResponse

api = NinjaAPI(docs=ScalarViewer(), docs_url='/docs/')
router = Router()

class TagSchema(BaseModel):
    nome: str
    
class TaskSchema(BaseModel):
    id: int
    titulo: str
    status_id: int | None
    descricao: str | None = None  # Add description field

class TaskCreateSchema(BaseModel):
    titulo: str
    status_id: int | None = None
    descricao: str | None = None  # Add description field

class TaskUpdateSchema(BaseModel):
    titulo: str
    descricao: str | None = None
    status_id: int | None = None

def task_to_dict(task):
    return {
        "id": task.id,
        "titulo": task.titulo,
        "status_id": str(task.status.id) if task.status else None,
        "descricao": task.description,
        "created_at": task.created_at,
        "updated_at": task.updated_at,
    }

@router.get("/tasks/", response=List[TaskSchema])
def listar_tasks(request):
    return [
        task_to_dict(task)
        for task in Task.objects.select_related("status").all()
    ]

@router.post("/tasks/")
def criar_task(request, payload: TaskCreateSchema):
    task = Task.objects.create(
        titulo=payload.titulo,
        status_id=payload.status_id,
        description=payload.descricao  # Add description to creation
    )
    return task_to_dict(task)

@router.put("/tasks/{task_id}/")
def atualizar_task(request, task_id: int, payload: TaskUpdateSchema):
    try:
        task = Task.objects.get(id=task_id)
        task.titulo = payload.titulo
        task.description = payload.descricao
        if payload.status_id:
            task.status_id = payload.status_id
        task.save()
        return task_to_dict(task)
    except Task.DoesNotExist:
        return {"error": "Task not found"}, 404

@router.delete("/tasks/{task_id}/")
def deletar_task(request, task_id: int):
    task = Task.objects.get(id=task_id)
    task.delete()
    return {"success": True}

@router.get("/tags/", response=list[TagSchema])
def listar_tags(request):
    tags = Tag.objects.all()
    return [{"nome": tag.nome} for tag in tags]

@router.post("/tags/", response=TagSchema)
def criar_tag(request, data: TagSchema):
    tag = Tag.objects.create(nome=data.nome)
    return {"nome": tag.nome}

@router.delete("/tags/{tag_id}/")
def deletar_tag(request, tag_id: int):
    tag = get_object_or_404(Tag, id=tag_id)
    tag.delete()
    return {"success": True}

api.add_router("/api/", router)