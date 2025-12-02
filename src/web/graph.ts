import { TypeSource, IResolvers } from '@graphql-tools/utils';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { Request, RequestParams } from 'graphql-http/lib';
import { createHandler } from 'graphql-http/lib/use/express';
import { is } from '../../shared';
import * as web from '../web';

export namespace Graph {
    export type Types = TypeSource;
    export type Resolvers = IResolvers;
    export type Context = ( ( req: Request<Any, Any>, params: RequestParams ) => Promise<Context | Response> | Context | Response );

    export class Config {
        private static _context: Graph.Context = IDENTITY_FN_FN( EMPTY_OBJECT ) as Ignore;  // returns a function that returns an empty object
        private static _handler: web.Context.MiddlewareFn;
        private static _resolvers: IResolvers;
        private static _types: TypeSource;

        public static getMiddleware(): web.Context.MiddlewareFn {
            return ( request: web.Context.Request, response: web.Context.Response, next: web.Context.NextFn ) => {
                if( is.not.func( this._handler ) ) {
                    throw new Error( 'graph.config: handler is invalid' );
                }

                this._handler( request, response, next );
            }
        }

        public static init(): typeof Graph.Config {
            if( is.not.ok( this._types ) ) {
                throw new Error( 'graph.config: types is invalid' );
            }

            if( is.not.ok( this._resolvers ) ) {
                throw new Error( 'graph.config: resolvers is invalid' );
            }

            this._handler = createHandler( {
                context: async ( request, params ) => {
                    return {
                        cxt: request.context.res.locals.cxt,
                        ...( await this._context( request, params ) ),
                    };
                },
                schema: makeExecutableSchema( {
                    typeDefs: this._types,
                    resolvers: this._resolvers,
                } ),
            } );

            return this;
        }

        public static setContext( context: AnyFn ): typeof Graph.Config {
            this._context = context;
            return this;
        }

        public static setResolvers( resolvers: IResolvers ): typeof Graph.Config {
            this._resolvers = resolvers;
            return this;
        }

        public static setTypes( types: TypeSource ): typeof Graph.Config {
            this._types = types;
            return this;
        }
    }

    @web.attr.router( '/api/graph' )
    export class Router extends web.Router.Json {
        @web.attr.get.root()
        @web.attr.middleware( Graph.Config.getMiddleware() )
        public static async onGet(): Promise<void> {}

        @web.attr.post.root()
        @web.attr.middleware( Graph.Config.getMiddleware() )
        public static async onPost(): Promise<void> {}

        @web.attr.put.root()
        @web.attr.middleware( Graph.Config.getMiddleware() )
        public static async onPut(): Promise<void> {}

        @web.attr.del.root()
        @web.attr.middleware( Graph.Config.getMiddleware() )
        public static async onDelete(): Promise<void> {}
    }
}
