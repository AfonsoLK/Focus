from rest_framework import serializers
from .models import Task, Status

class TaskSerializer(serializers.ModelSerializer):
    status_id = serializers.PrimaryKeyRelatedField(
        source='status',
        queryset=Status.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Task
        fields = ['id', 'titulo', 'status_id', 'created_at', 'updated_at']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['status_id'] = str(instance.status.id) if instance.status else None
        return ret

    def create(self, validated_data):
        return Task.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.titulo = validated_data.get('titulo', instance.titulo)
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance
