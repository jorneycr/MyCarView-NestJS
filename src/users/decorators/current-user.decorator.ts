import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrrentUser = createParamDecorator(
    (data: never, context: ExecutionContext) => {
        return 'Hello there!';
    }
)
