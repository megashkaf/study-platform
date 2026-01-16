import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import "./button.css";

const button = cva("transition-colors text-base focus:outline-auto", {
    variants: {
        variant: {
            primary: "bg-blue-600 text-white hover:bg-blue-700",
            secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
            transparent: "bg-transparent text-gray-900 hover:bg-gray-300",
        },
        size: {
            sm: "text-sm px-3 py-1.5",
            md: "text-base px-6 py-2",
            lg: "text-lg px-5 py-3",
        },
        borderRadius: {
            sharp: "rounded-none",
            rounded: "rounded-lg",
            pill: "rounded-full",
        },
    },
    defaultVariants: {
        variant: "primary",
        size: "md",
        borderRadius: "rounded",
    },
});

interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof button> {}

export const Button = ({
    borderRadius,
    variant,
    size,
    className,
    ...props
}: ButtonProps) => (
    <button
        className={button({ borderRadius, variant, size, className })}
        {...props}
    />
);
