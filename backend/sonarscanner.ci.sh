docker run \
    --rm \
    -e SONAR_HOST_URL="http://10.255.7.112:9000" \
    -e SONAR_LOGIN="36af0087b98b23e70b6b03afc931f26d8f2cd53a" \
    -v $PWD:/usr/src \
    --network=host \
    sonarsource/sonar-scanner-cli \
    -Dsonar.projectKey="symrise-backend"