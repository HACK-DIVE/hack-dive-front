import Image from "next/image";
import React from "react";
import GenImage from "../buttons/GenImage";

export default function AIImages() {
  return (
    <div className="my-11 grid max-w-[320px] grid-cols-2 gap-1 overflow-hidden rounded-3xl">
      <GenImage src={"/stool_1.png"} alt={1}></GenImage>
      <GenImage src={"/stool_2.png"} alt={2}></GenImage>
      <GenImage src={"/stool_3.png"} alt={3}></GenImage>
      <GenImage src={"/stool_4.png"} alt={4}></GenImage>
    </div>
  );
}
