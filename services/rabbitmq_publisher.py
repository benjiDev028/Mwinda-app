# app/services/rabbitmq_publisher.py
import pika
import json
import logging

logger = logging.getLogger(__name__)

class RabbitMQPublisher:
    def __init__(self, rabbitmq_url: str):
        self.rabbitmq_url = rabbitmq_url

    def publish(self, queue: str, message: dict):
        """
        Publie un message dans une queue RabbitMQ.
        """
        try:
            connection = pika.BlockingConnection(pika.URLParameters(self.rabbitmq_url))
            channel = connection.channel()
            channel.queue_declare(queue=queue, durable=True)
            channel.basic_publish(
                exchange='',
                routing_key=queue,
                body=json.dumps(message),
                properties=pika.BasicProperties(delivery_mode=2),  # Rendre le message persistant
            )
            logger.info(f"Message publié dans la queue {queue}: {message}")
            connection.close()
        except Exception as e:
            logger.error(f"Erreur lors de la publication du message : {e}")
# app/services/rabbitmq_publisher.py
import pika
import json
import logging

logger = logging.getLogger(__name__)

class RabbitMQPublisher:
    def __init__(self, rabbitmq_url: str):
        self.rabbitmq_url = rabbitmq_url

    def publish(self, queue: str, message: dict):
        """
        Publie un message dans une queue RabbitMQ.
        """
        try:
            connection = pika.BlockingConnection(pika.URLParameters(self.rabbitmq_url))
            channel = connection.channel()
            channel.queue_declare(queue=queue, durable=True)
            channel.basic_publish(
                exchange='',
                routing_key=queue,
                body=json.dumps(message),
                properties=pika.BasicProperties(delivery_mode=2),  # Rendre le message persistant
            )
            logger.info(f"Message publié dans la queue {queue}: {message}")
            connection.close()
        except Exception as e:
            logger.error(f"Erreur lors de la publication du message : {e}")
