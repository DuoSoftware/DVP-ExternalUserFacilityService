FROM node:9.9.0
ARG VERSION_TAG
RUN git clone -b $VERSION_TAG https://github.com/DuoSoftware/DVP-ExternalUserFacilityService.git /usr/local/src/externaluserfacilityservice

RUN cd /usr/local/src/externaluserfacilityservice;
WORKDIR /usr/local/src/externaluserfacilityservice
RUN npm install
EXPOSE 8819
CMD [ "node --expose-gc", "/usr/local/src/externaluserfacilityservice/app.js" ]
