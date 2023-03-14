from rest_framework import serializers
from stdcgh_api.account import models as acc_model
from django.contrib.auth.models import (User, Group)
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction, connection
from stdcgh_api.configuration import models as conf_models
from stdcgh_api.configuration.serializers import (
    PropertySerializer
)


class UserGroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = Group

        fields = [
            'id',
            'name',

        ]


class UserProfileSerializer(serializers.ModelSerializer):
    
    related_property = PropertySerializer(source='property', read_only=True)

    class Meta:
        model = acc_model.UserProfile

    # user=models.ForeignKey(User,on_delete=models.CASCADE)
    # designation=models.ForeignKey(Designation,on_delete=models.CASCADE)
    # office=models.ForeignKey(Office,on_delete=models.CASCADE)
    # first_name=models.CharField(max_length=128,blank=False)
    # middle_name=models.CharField(max_length=128,blank=True, default='')
    # last_name=models.CharField(max_length=128,blank=True, default='')
    # contact_number=models.CharField(max_length=12)
    # created_at=models.DateTimeField(auto_now_add=True)
    # updated_at=models.DateTimeField(auto_now_add=True)

        fields = [
            'id',
            'user',
            'property',
            'contact_number',
            'created_at',
            'updated_at',

            'related_property',

        ]


class ResgisteredUserSerializer(serializers.ModelSerializer):
    related_profile = UserProfileSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'related_profile',

        ]


class RegisterSerializer(serializers.ModelSerializer):
    related_profile = UserProfileSerializer(many=True, read_only=True)
    related_groups = UserGroupSerializer(
        source='groups',  many=True, read_only=True)
    email = serializers.EmailField(
        required=False,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    # email=serializers.CharField(write_only=True, max_length=128)
    first_name = serializers.CharField(max_length=128)
    last_name = serializers.CharField(max_length=128)
    property = serializers.IntegerField(write_only=True, required=True)
    contact_number = serializers.CharField(write_only=True, max_length=12)
    is_staff = serializers.BooleanField(default=False)
    group = serializers.CharField(max_length=128, write_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'password', 'password2',
            'email',
            'first_name',
            'last_name',
            'property',
            'is_staff',
            'group',
            'contact_number',
            'related_groups',
            'related_profile',
        ]
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'property': {'required': True},
            'contact_number': {'required': True},
            'group': {'required': True}
        }

    def validate(self, attrs):
        if 'password' in attrs:
            if attrs['password'] != attrs['password2']:
                raise serializers.ValidationError(
                    {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):

        try:
            with transaction.atomic():
                user = User.objects.create(
                    username=validated_data['username'],
                    email=validated_data.get('email', ''),
                    first_name=validated_data['first_name'],
                    last_name=validated_data['last_name'],
                    is_staff=True if validated_data['group'] == 'user' else False,
                )
                user.groups.add(Group.objects.get(
                    id=validated_data['group']))
                user.set_password(validated_data['password'])
                user.save()
                user_profile = acc_model.UserProfile.objects.update_or_create(
                    user=user,
                    defaults={

                        "property": acc_model.Property.objects.get(pk=validated_data.get('property', '')),
                        "contact_number": validated_data['contact_number']
                    }

                )

                return user

                # return Response(serializers.data(), status=status.HTTP_200_OK)

        except TypeError:
            return TypeError("There is some error in processing your data.")

    def update(self, instance, validated_data):

        try:
            with transaction.atomic():
                user = instance

                user.username = validated_data['username']
                # user.email = validated_data['email']
                user.first_name = validated_data['first_name']
                user.last_name = validated_data['last_name']
                user.is_staff = True if validated_data['group'] == 'user' else False
                # user.set_password(validated_data['password'])
                user.groups.clear();
                user.groups.add(Group.objects.get(
                    id=validated_data['group']))
                user.save()

                user_profile = acc_model.UserProfile.objects.update_or_create(
                    user=user,
                    defaults={

                        "property": acc_model.Property.objects.get(pk=validated_data.get('property', '')),
                        "contact_number": validated_data['contact_number']
                    }

                )

                return user

        except TypeError:
            return TypeError("There is some error in processing your data.")

class UpdateUserPasswordSerializer(serializers.ModelSerializer):
    

    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    # email=serializers.CharField(write_only=True, max_length=128)


    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'password', 'password2',


        ]


    def validate(self, attrs):
        if 'password' in attrs:
            if attrs['password'] != attrs['password2']:
                raise serializers.ValidationError(
                    {"password": "Password fields didn't match."})

        return attrs


    def update(self, instance, validated_data):

        try:
            with transaction.atomic():
                user = instance

                user.set_password(validated_data['password'])
                user.save()
                return user

        except TypeError:
            return TypeError("There is some error in processing your data.")


class LeanUserSerializer(serializers.ModelSerializer):
    related_profile = UserProfileSerializer(many=True, read_only=True)
    related_groups = UserGroupSerializer(
        source='groups',  many=True, read_only=True)

    class Meta:
        model = User

        fields = [

            'id',
            'username',
            'first_name',
            'last_name',
            'related_profile',
            'is_staff',
            'related_groups'

        ]
