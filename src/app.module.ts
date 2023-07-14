import { Inject, Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { join } from "path";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserSchema } from "./auth/dto/signup.dto";
import { JwtModule } from "@nestjs/jwt";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import { PostModule } from './post/post.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: GraphQLFormattedError = {
          message:
            (error?.extensions?.exception as any)?.response?.message ||
            error?.message,
        };
        return graphQLFormattedError;
      },
    }),

    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow("DATABASE_URL"),
      }),
      inject: [ConfigService],
    }),

    AuthModule,

    UserModule,

    PostModule,

    ChatModule,
  ],
  providers: [ConfigService],
})
export class AppModule {}
