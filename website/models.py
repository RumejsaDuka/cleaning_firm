from django.db import models

class ContactMessage(models.Model):
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    service = models.CharField(max_length=100)
    property_type = models.CharField(max_length=100, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Kontakt Nachricht'
        verbose_name_plural = 'Kontakt Nachrichten'

    def __str__(self):
        return f"{self.full_name} — {self.service} ({self.created_at.strftime('%d.%m.%Y')})"