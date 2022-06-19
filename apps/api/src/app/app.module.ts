import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { credential } from "firebase-admin"
import * as Joi from "joi"
import { SWAGGER_PATH } from "src/common/common.constants"
import { ApiKeyMiddleware } from "src/common/middlewares/api-key.middleware"
import configuration from "src/config/configuration"
import { FileUploadsModule } from "src/file-uploads/file-uploads.module"
import { FirebaseAdminModule } from "src/firebase-admin/firebase-admin.module"

import cert = credential.cert

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      validationSchema: Joi.object({
        FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON: Joi.string().required(),
        FIREBASE_STORAGE_BUCKET_URL: Joi.string().required(),
        MONGODB_URI: Joi.string().required(),
        SERVER_API_KEY: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get("db.uri"),
        }
      },
    }),
    FirebaseAdminModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const serviceAccount = configService.get("firebase.serviceAccount")
        const storageBucket = configService.get("firebase.bucketUrl")
        return {
          credential: cert(serviceAccount),
          storageBucket,
        }
      },
    }),
    FileUploadsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleware)
      .exclude({ path: SWAGGER_PATH, method: RequestMethod.ALL })
      .forRoutes({ path: "*", method: RequestMethod.ALL })
  }
}
