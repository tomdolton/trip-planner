interface VenLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function VenLogo({ width = 56, height = 58, className }: VenLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 56 58"
      fill="none"
      className={className}
    >
      <path
        d="M12.1016 44.1522L8.83536 34.8176H4.91992L10.3933 49.3181H13.7348L19.2492 34.8176H15.4158L12.1016 44.1522Z"
        fill="currentColor"
      />
      <path
        d="M26.5059 43.4279H32.8813V40.4215H26.5059V37.9059H33.5168V34.8176H26.5059H25.7474H22.8364V49.3181H25.7474H26.5059H33.6193V46.2298H26.5059V43.4279Z"
        fill="currentColor"
      />
      <path
        d="M46.8211 34.8176V43.0444L40.3022 34.8176H37.7397V49.3181H41.4092V41.2787L47.7641 49.3181H50.4905V34.8176H46.8211Z"
        fill="currentColor"
      />
      <path
        d="M12.2061 7.75122H19.3775L28.2385 20.169V30.5228L12.2061 7.75122Z"
        fill="url(#paint0_linear_6_712)"
      />
      <path
        d="M44.269 7.75122H37.0993L28.2383 20.169V30.5228L44.269 7.75122Z"
        fill="url(#paint1_linear_6_712)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_6_712"
          x1="19.2101"
          y1="6.84111"
          x2="22.0415"
          y2="26.8381"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#556EFF" />
          <stop offset="1" stopColor="#13AE8D" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_6_712"
          x1="38.4813"
          y1="6.87349"
          x2="32.7232"
          y2="25.2811"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0D6D85" />
          <stop offset="0.26" stopColor="#0C6982" />
          <stop offset="0.53" stopColor="#0A5D7B" />
          <stop offset="0.79" stopColor="#08496E" />
          <stop offset="1" stopColor="#053361" />
        </linearGradient>
      </defs>
    </svg>
  );
}
