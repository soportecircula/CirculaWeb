"""Inicialización de MinIO al arranque: crea el bucket y configura acceso público.

Se invoca desde app/main.py en el evento startup.
"""

from __future__ import annotations

import json
import logging

import boto3
from botocore.exceptions import ClientError

from app.core.config import settings

logger = logging.getLogger(__name__)


def init_minio() -> None:
    """Crea el bucket de MinIO si no existe y aplica una política de lectura pública."""
    if settings.STORAGE_BACKEND != "minio":
        return

    client = boto3.client(
        "s3",
        endpoint_url=settings.MINIO_ENDPOINT,
        aws_access_key_id=settings.MINIO_ROOT_USER,
        aws_secret_access_key=settings.MINIO_ROOT_PASSWORD,
    )
    bucket = settings.MINIO_BUCKET

    # Crear bucket si no existe
    try:
        client.head_bucket(Bucket=bucket)
        logger.info("MinIO bucket '%s' already exists", bucket)
    except ClientError as exc:
        error_code = exc.response["Error"]["Code"]
        if error_code in ("404", "NoSuchBucket"):
            client.create_bucket(Bucket=bucket)
            logger.info("MinIO bucket '%s' created", bucket)
        else:
            logger.error("MinIO head_bucket error: %s", exc)
            raise

    # Política de lectura pública para objetos (GetObject sin auth)
    public_policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {"AWS": ["*"]},
                "Action": ["s3:GetObject"],
                "Resource": [f"arn:aws:s3:::{bucket}/*"],
            }
        ],
    }
    try:
        client.put_bucket_policy(Bucket=bucket, Policy=json.dumps(public_policy))
        logger.info("MinIO public-read policy set on bucket '%s'", bucket)
    except ClientError as exc:
        logger.error("MinIO put_bucket_policy error: %s", exc)
        raise
