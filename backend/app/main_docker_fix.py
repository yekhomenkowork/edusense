import docker
import os

def get_docker_client():
    # Спосіб 1: Через змінні середовища (стандарт)
    try:
        return docker.from_env()
    except:
        pass

    # Спосіб 2: Явний шлях (3 слеші)
    try:
        return docker.DockerClient(base_url='unix:///var/run/docker.sock')
    except:
        pass
        
    # Спосіб 3: Явний шлях (через мета-обгортку)
    try:
        return docker.APIClient(base_url='unix://var/run/docker.sock')
    except Exception as e:
        print(f"Всі методи підключення до Docker провалено: {e}")
        return None

# Оновлюємо ендпоінт, щоб він повертав реальну помилку у разі факапу
