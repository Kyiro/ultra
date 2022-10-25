import type { TRPCLink } from "@trpc/client";
import type { AnyProcedure } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { type AppRouter, appRouter } from "../server/router.ts";
import { trpc } from "./trpc.ts";

const customLink: TRPCLink<AppRouter> = () => {
  return ({ op }) => {
    if (op.type === "query") {
      return observable((observer) => {
        const procedure = appRouter._def
          .procedures[
            op.path as keyof typeof appRouter._def.procedures
          ] as AnyProcedure;

        const promise = procedure({
          ctx: op.context,
          path: op.path,
          rawInput: op.input,
          type: op.type,
        });

        promise.then((data) => {
          observer.next({ result: { data } });
          observer.complete();
        }).catch((error) => {
          observer.error(error);
        });
      });
    }

    throw new Error("only query supported");
  };
};

export const trpcClient = trpc.createClient({
  links: [customLink],
});
