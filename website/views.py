from django.conf import settings
from django.core.mail import send_mail
from django.http import JsonResponse
from django.shortcuts import render

from .forms import ContactForm
from .models import ContactMessage


def home(request):
    form = ContactForm()
    sent = False

    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            data = form.cleaned_data
            service = dict(form.fields['service'].choices).get(data['service'], data['service'])
            property_type = dict(form.fields['property_type'].choices).get(
                data.get('property_type'), data.get('property_type') or 'Nicht angegeben'
            )

            ContactMessage.objects.create(
                full_name=data['full_name'],
                email=data['email'],
                phone=data.get('phone', ''),
                service=data['service'],
                property_type=data.get('property_type', ''),
                message=data['message'],
            )

            body = (
                'Neue Kontaktanfrage von der Website\n\n'
                f'Name: {data["full_name"]}\n'
                f'E-Mail: {data["email"]}\n'
                f'Telefon: {data.get("phone") or "Nicht angegeben"}\n'
                f'Dienstleistung: {service}\n'
                f'Objektart: {property_type}\n\n'
                f'Nachricht:\n{data["message"]}\n'
            )

            send_mail(
                subject=f'Neue Anfrage: {service}',
                message=body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.CONTACT_RECIPIENT_EMAIL],
                fail_silently=True,
            )

            sent = True
            form = ContactForm()

            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'ok': True, 'message': 'Vielen Dank! Ihre Nachricht wurde gesendet.'})

        elif request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'ok': False, 'errors': form.errors}, status=400)

    return render(request, 'website/home.html', {'form': form, 'sent': sent})

def datenschutz(request):
    return render(request, 'website/datenschutz.html')

def impressum(request):
    return render(request, 'website/impressum.html')