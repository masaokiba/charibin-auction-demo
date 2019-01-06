import random

from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework import generics
from rest_framework import status
from rest_framework import views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.serializers.entities import ProductSerializer
from api.serializers.storage import MediumSerializer
from api.serializers.storage import UploadMediumSerializer
from api.permissions import IsAdmin
from entity.models import Product
from entity.models import ProductMedium
from storage.constants import VALID_IMAGE_MIMETYPES
from storage.constants import VALID_VIDEO_MIMETYPES
from storage.mixins import MediumUploadMixin
from storage.mixins import MediumDeleteMixin


class ProductListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = ProductSerializer
    queryset = Product.objects.all().select_related('donor')


class ProductDetailView(MediumDeleteMixin, generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = ProductSerializer
    lookup_url_kwarg = 'pk'
    queryset = Product.objects.all()

    @transaction.atomic
    def perform_destroy(self, instance):
        product_media = instance.productmedium_set.select_related('medium')
        for pm in product_media:
            self.delete_medium(pm.medium)
            pm.delete()
        super(ProductDetailView, self).perform_destroy(instance)


class ProductMediumUploadView(MediumUploadMixin, generics.GenericAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = ProductSerializer
    lookup_url_kwarg = 'pk'
    queryset = Product.objects.all()

    def get_uploaded_file(self):
        serializer = UploadMediumSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        return serializer.validated_data['file']

    def post(self, *args, **kwargs):
        file = self.get_uploaded_file()
        product = self.get_object()
        if file.content_type in VALID_VIDEO_MIMETYPES:
            medium = self.upload_video(
                file,
                'product',
                '{}_{}'.format(product.pk, random.randint(10000000, 99999999))
            )
        else:
            medium = self.upload_image(
                file,
                'product',
                '{}_{}'.format(product.pk, random.randint(10000000, 99999999))
            )

        order = 1
        product_medium = ProductMedium.objects.create(
            medium=medium,
            product=product,
            order=order
        )

        medium_data = MediumSerializer(medium)
        return Response(medium_data.data)


class ProductMediumDeleteView(MediumDeleteMixin, generics.GenericAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = ProductSerializer
    lookup_url_kwarg = 'pk'
    queryset = Product.objects.all()

    @transaction.atomic
    def delete(self, *args, **kwargs):
        if 'pm_pk' not in self.kwargs:
            raise status.NotFound()

        product = self.get_object()
        pm_pk = self.kwargs['pm_pk']
        pm = get_object_or_404(product.productmedium_set, pk=pm_pk)
        self.delete_medium(pm.medium)
        pm.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
