import datetime
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_STORAGE_BUCKET_NAME = os.getenv("AWS_STORAGE_BUCKET_NAME")

AWS_FILE_EXPIRE = 200
AWS_PRELOAD_METADATA = True
AWS_QUERYSTRING_AUTH = True

DEFAULT_FILE_STORAGE = 'backend.aws.utils.MediaRootS3Boto3Storage'
STATICFILES_STORAGE = 'backend.aws.utils.StaticRootS3Boto3Storage'
S3DIRECT_REGION = 'ap-southeast-2'
S3_URL = 'https://easystay-bucket-ko.s3.ap-southeast-2.amazonaws.com/'
MEDIA_URL = 'https://easystay-bucket-ko.s3.ap-southeast-2.amazonaws.com/media/'
MEDIA_ROOT = MEDIA_URL
STATIC_URL = S3_URL + 'static/'
ADMIN_MEDIA_PREFIX = STATIC_URL + 'admin/'

two_months = datetime.timedelta(days=61)
date_two_months_later = datetime.date.today() + two_months
expires = date_two_months_later.strftime("%A, %d %B %Y 20:00:00 GMT")

AWS_HEADERS = {
    'Expires': expires,
    'Cache-Control': 'max-age=%d' % (int(two_months.total_seconds()), ),
}