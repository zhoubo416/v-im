FROM openjdk:11.0.10-jdk-oracle

LABEL "vendor"="ETIME" \
      "version"="0.01" \
      "description"="this is spd server image report"

FROM V-IM/ruoyi-admin

MAINTAINER aliyu<dager@qq.com>

COPY target/ruoyi-admin-3.8.6.jar /ruoyi-admin-3.8.6.jar

ENTRYPOINT ["java", "-jar", "/myframe-0.0.1-SNAPSHOT.jar"]


EXPOSE 8070
