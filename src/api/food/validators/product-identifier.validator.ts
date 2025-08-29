import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";

@ValidatorConstraint({ name: "ProductIdentifier", async: false })
export class ProductIdentifierValidator implements ValidatorConstraintInterface {
    validate(product: any, args: ValidationArguments) {
        // Либо product_id, либо product_code + name
        const hasProductId = product.product_id && !product.product_code;
        const hasProductCodeWithName = product.product_code && product.name && !product.product_id;

        return hasProductId || hasProductCodeWithName;
    }

    defaultMessage(args: ValidationArguments) {
        return "Product must have either product_id or product_code with name";
    }
}