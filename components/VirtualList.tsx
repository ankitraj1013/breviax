"use client";

/**
 * react-window currently has typing issues with
 * React 19 + Next.js App Router.
 * 
 * We intentionally cast to `any` here
 * to isolate the problem to ONE file.
 */

import * as RW from "react-window";

const FixedSizeList = RW.FixedSizeList as any;

export default FixedSizeList;
