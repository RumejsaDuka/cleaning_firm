from django import forms


SERVICE_CHOICES = [
    ('', 'Dienstleistung auswählen'),
    ('unterhaltsreinigung', 'Unterhaltsreinigung'),
    ('bueroreinigung', 'Büroreinigung'),
    ('gebaeudereinigung', 'Gebäudereinigung'),
    ('treppenhausreinigung', 'Treppenhausreinigung'),
    ('fensterreinigung', 'Fensterreinigung'),
    ('winterdienst', 'Winterdienst'),
    ('solar-reinigung', 'Solar Reinigung'),
    ('fassaden-reinigung', 'Fassaden Reinigung'),
    ('gartenpflege', 'Gartenpflege'),
    ('sonderreinigung', 'Sonderreinigung'),
]


PROPERTY_CHOICES = [
    ('', 'Objektart auswählen'),
    ('wohnung', 'Wohnung'),
    ('haus', 'Privathaus'),
    ('buero', 'Büro / Arbeitsfläche'),
    ('gewerbe', 'Gewerbeobjekt'),
    ('industrie', 'Industrieanlage'),
    ('andere', 'Andere'),
]


class ContactForm(forms.Form):
    full_name = forms.CharField(
        label='Vollständiger Name',
        min_length=2,
        widget=forms.TextInput(attrs={'id': 'fullName', 'placeholder': 'Ihr vollständiger Name'}),
    )
    email = forms.EmailField(
        label='E-Mail-Adresse',
        widget=forms.EmailInput(attrs={'id': 'email', 'placeholder': 'ihre@email.de'}),
    )
    phone = forms.CharField(
        label='Telefonnummer',
        required=False,
        widget=forms.TextInput(attrs={'id': 'phone', 'placeholder': '+49 ...'}),
    )
    service = forms.ChoiceField(
        label='Gewünschte Dienstleistung',
        choices=SERVICE_CHOICES,
        widget=forms.Select(attrs={'id': 'service'}),
    )
    property_type = forms.ChoiceField(
        label='Objektart',
        required=False,
        choices=PROPERTY_CHOICES,
        widget=forms.Select(attrs={'id': 'propertyType'}),
    )
    message = forms.CharField(
        label='Nachricht',
        min_length=10,
        widget=forms.Textarea(attrs={
            'id': 'message',
            'rows': 4,
            'placeholder': 'Beschreiben Sie kurz, wobei wir helfen dürfen...',
        }),
    )
