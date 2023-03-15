# Generated by Django 4.1.7 on 2023-02-28 10:18

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('configuration', '0008_property_is_operational_alter_room_property_and_more'),
        ('operation', '0006_reservationdetails_discount_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='guestcheckincheckoutdetails',
            name='address',
            field=models.CharField(blank=True, max_length=1024, null=True),
        ),
        migrations.AddField(
            model_name='guestcheckincheckoutdetails',
            name='contact_no',
            field=models.CharField(blank=True, max_length=12, null=True),
        ),
        migrations.AddField(
            model_name='guestcheckincheckoutdetails',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='guestcheckincheckoutdetails',
            name='created_by',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='guest_checkin_check_out', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='guestcheckincheckoutdetails',
            name='lead_guest',
            field=models.CharField(blank=True, max_length=1024, null=True),
        ),
        migrations.AddField(
            model_name='guestcheckincheckoutdetails',
            name='no_adult',
            field=models.IntegerField(default=0, max_length=2),
        ),
        migrations.AddField(
            model_name='guestcheckincheckoutdetails',
            name='no_child',
            field=models.IntegerField(default=0, max_length=2),
        ),
        migrations.AddField(
            model_name='guestcheckincheckoutdetails',
            name='property',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='guest_checkin_check_out', to='configuration.property'),
        ),
        migrations.AddField(
            model_name='guestcheckincheckoutdetails',
            name='room',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='guest_checkin_check_out', to='configuration.room'),
        ),
        migrations.AddField(
            model_name='guestcheckincheckoutdetails',
            name='updated_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='reservationdetails',
            name='is_bill_generated',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='guestcheckincheckoutdetails',
            name='checkout_date',
            field=models.DateField(null=True),
        ),
        migrations.CreateModel(
            name='MiscellaneousServiceChargeDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('particular', models.CharField(max_length=1024)),
                ('cost', models.DecimalField(decimal_places=2, max_digits=8)),
                ('remarks', models.CharField(blank=True, max_length=2048, null=True)),
                ('reservation', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='miscellaneous_service_charge', to='operation.reservationdetails')),
            ],
        ),
    ]