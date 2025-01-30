from django.db import models


class Tag(models.Model):
    nome = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.nome
    

class Task(models.Model):
    titulo = models.CharField(max_length=100)
    descricao = models.TextField(blank=True, null=True)
    tags = models.ManyToManyField(Tag, related_name="tasks", blank=True)  # Permite que seja opcional

    def __str__(self):
        return self.titulo