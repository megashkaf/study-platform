import React from "react";
import { cva, VariantProps } from "class-variance-authority";

const heading = cva("", {
    variants: {
        level: {
            1: "text-3xl font-bold mb-4",
            2: "text-2xl font-semibold mb-3",
            3: "text-xl font-medium mb-2",
        },
    },
    defaultVariants: {
        level: 2,
    },
});

interface HeadingProps
    extends React.HTMLAttributes<HTMLHeadingElement>,
        VariantProps<typeof heading> {
    children: React.ReactNode;
}

export const Heading = ({
    level,
    className,
    children,
    ...props
}: HeadingProps) => {
    type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    const DynamicTag = `h${level}` as HeadingTag;

    return (
        <DynamicTag className={heading({ level, className })} {...props}>
            {children}
        </DynamicTag>
    );
};
