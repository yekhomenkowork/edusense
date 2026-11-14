FROM postgres:15.17-alpine
RUN apk add --no-cache openssl age python3 py3-pip \
    && python3 -m venv /opt/test-venv \
    && /opt/test-venv/bin/pip install --no-cache-dir paho-mqtt==2.1.0 pyotp==2.9.0
ENV PATH="/opt/test-venv/bin:$PATH"
ENTRYPOINT []
WORKDIR /tests
COPY prepare.sh integration.py restore.sh legacy.sh ./
COPY --chmod=0555 prepare.sh /usr/local/bin/prepare-edusense-tests
