from django.db import models

class Status(models.Model):
    nome = models.CharField(max_length=50, unique=True)

    class Meta:
        db_table = 'core_status'  
        verbose_name_plural = 'status'

    def __str__(self):
        return self.nome

    @classmethod
    def create_defaults(cls):
        defaults = ['Pendente', 'Em progresso', 'Concluído']
        for status in defaults:
            cls.objects.get_or_create(nome=status)

class Tag(models.Model):
    nome = models.CharField(max_length=50, unique=True)

    class Meta:
        db_table = 'core_tag'  # Explicitly set table name

    def __str__(self):
        return self.nome
    

def get_default_status():
    return Status.objects.get(nome='Pendente').id

class Task(models.Model):
    titulo = models.CharField(max_length=255)
    description= models.TextField(null=True, blank=True)
    status = models.ForeignKey(
        Status,
        on_delete=models.PROTECT,
        default=get_default_status,
        related_name='tasks'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'core_task'

    def __str__(self):
        return self.titulo