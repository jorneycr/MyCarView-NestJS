import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { map, Observable } from "rxjs";

export function Serialize(dto: any) {
    return UseInterceptors(new SerializeInterceptor(dto));
}
interface ClassConstructor {
    new(...args: any[]): {}
}
export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: ClassConstructor) { }
    intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> {
        return handler.handle().pipe(
            map((data: any) => {
                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true,
                });
            }),
        )
    }
}