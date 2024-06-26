from datetime import datetime
from django.contrib import admin
from django.contrib.auth.decorators import permission_required
from django.template.response import TemplateResponse
from django.urls import path
# from rest_framework import permissions
from . import dao
from .models import *
from django import forms
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from django.db.models import Count


# from alumnisocial.models import FriendShip, Group, AlumniProfile
# from ckeditor.widgets import CKEditorWidget
# from rest_framework import serializers



class SocialNetworkAppAdminSite(admin.AdminSite):
    site_header = 'AlumniSocialNetwork'

    def get_urls(self):
        return [
            path('stats/', self.stats_view),
            path('survey_stats/', self.survey_stats_view)
        ] + super().get_urls()

    def stats_view(self, request): #view cua controller
        survey_stats = Survey.objects.annotate(c=Count('post')).values('id', 'title', 'c')
        type_statistic = request.GET.get('object')
        period = request.GET.get('period')
        year = request.GET.get('year')
        period = period if period is not None else 'year'
        if type_statistic == 'users':
            stats = dao.count_users_by_time_period(period, year)
        else:
            stats = dao.count_posts_by_time_period(period, year)
        return TemplateResponse(request, 'admin/stats.html', {'stats': stats,
                                                              'period': period,
                                                              "survey_stats": survey_stats
                                                              }) #

    #xử lý yêu cầu cho trang thống kê
    def survey_stats_view(self, request):
        survey_id = request.POST.get('survey_id')
        if not survey_id:
            return TemplateResponse(request, 'admin/stats.html',
                                    {'error': 'Survey ID is required'})

        statistic_data = dao.stats_survey(survey_id) #lấy dữ liệu để thống kê
        if not statistic_data or not all(key in statistic_data for key in ['survey', 'text_questions', 'mcq_counts']):
            return TemplateResponse(request, 'admin/survey_stats.html',
                                    {'error': 'Invalid survey data'})

        return TemplateResponse(request, 'admin/survey_stats.html',
                                {'survey': statistic_data['survey'],
                                 'text_questions': statistic_data['text_questions'],
                                 'mcq_counts': statistic_data['mcq_counts']})


admin.site = SocialNetworkAppAdminSite(name='mysocialmediaapp')

class AlumniProfileInlineAdmin(admin.StackedInline):
    model = AlumniProfile


class AlumniAdmin(admin.ModelAdmin):
    search_fields = ['student_id']


class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'username', 'email', 'role', 'is_active']
    search_fields = ['username']
    list_filter = ['role', 'username', 'first_name', ]
    inlines = [AlumniProfileInlineAdmin, ]
    # actions = [reset_password_change_time, confirm_student]


class PostForm(forms.ModelForm):

    content = forms.CharField(widget=CKEditorUploadingWidget)

    class Meta:
        model = Post
        fields = '__all__'


class ImagesInlineAdmin(admin.StackedInline):
    model = Image


class PostAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'created_date', 'active', 'user', 'get_survey',]
    search_fields = ('title', 'survey__name')
    inlines = [ImagesInlineAdmin, ]
    form = PostForm

    def get_survey(self, obj):
        return ", ".join([s.title for s in obj.survey.all()])

    get_survey.short_description = 'Surveys'

class GroupAdmin(admin.ModelAdmin):
    list_display = ['name']


class ChoiceInlineAdmin(admin.StackedInline):
    model = Choice


class QuestionInline(admin.StackedInline):
    model = Question


class QuestionAdmin(admin.ModelAdmin):
    list_display = ['id', 'type', 'title', 'survey_id', 'survey', ]
    inlines = [ChoiceInlineAdmin, ]

class SurveyAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'title']
    inlines = [QuestionInline, ]


class InvitationAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'title', 'time', 'place']


class CommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'post', 'comment', 'created_date', 'active']


admin.site.register(User, UserAdmin)
admin.site.register(AlumniProfile, AlumniAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Survey, SurveyAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Invitation, InvitationAdmin)
admin.site.register(Group, GroupAdmin)
admin.site.register(Comment, CommentAdmin)
