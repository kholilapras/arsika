import React from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement>;

export default function AppLogoIcon(props: Props) {
    const { className = "", ...rest } = props;

    return (
        <img
            src="/logoo.svg"
            alt="Logo Tel-U"
            className={`${className} opacity-70`} // ubah 70 sesuai selera: 50/60/80
            {...rest}
        />
    );
}
