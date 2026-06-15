from django.shortcuts import render

# Create your views here.
from rest_framework import generics, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from django.db.models import Count
from .models import Project, Task
from .serializers import RegisterSerializer, ProjectSerializer, TaskSerializer, UserSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class UserProfileView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    def get_object(self):
        return self.request.user

class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(members=self.request.user) | Project.objects.filter(created_by=self.request.user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TaskSerializer

    def get_queryset(self):
        queryset = Task.objects.all()
        project_id = self.request.query_params.get('project_id')
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset

    @action(detail=True, methods=['patch'], url_path='move')
    def move_task(self, request, pk=None):
        task = self.get_object()
        new_status = request.data.get('status')
        if new_status in dict(Task.STATUS_CHOICES):
            task.status = new_status
            task.save()
            return Response(TaskSerializer(task).data)
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

class SprintSummaryAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        project_id = request.query_params.get('project_id')
        if not project_id:
            return Response({'error': 'project_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        summary = Task.objects.filter(project_id=project_id).values('status').annotate(count=Count('id'))
        priority_summary = Task.objects.filter(project_id=project_id).values('priority').annotate(count=Count('id'))

        return Response({
            'task_status_distribution': summary,
            'priority_distribution': priority_summary
        }, status=status.HTTP_200_OK)



from django.core.cache import cache
from rest_framework.decorators import api_view # 💡 DRF standard decorator
from rest_framework.response import Response   # 💡 DRF standard response 

@api_view(['GET'])
def get_cluster_status(request):
    cluster_data = cache.get('k8s_status')
    
    if not cluster_data:
        cluster_data = {"status": "Healthy", "pods_running": 12} 
        cache.set('k8s_status', cluster_data, timeout=60)
        print("Fetched from Cluster and Saved to Redis!")
    else:
        print("Fetched directly from Redis Cache!")
        
    return Response(cluster_data)