"use client";
import { SWRConfig } from 'swr';
import React, { useEffect, useState } from 'react';
import AuthProviders from "@/providers/auth";
import ThemeProviders from '@/providers/theme';
import { fetcher } from '../services/fetcher';
import { ToasterContext } from '@/contexts/toaster-context';

export function Providers({ children }:  { children: React.ReactNode }) {

    const [isMounted, setIsMounted] = useState<boolean>(false)

    useEffect(() => {
        if (!isMounted)
            setIsMounted(true)
    }, [])

    if (!isMounted)
        return null

    if (typeof window === 'undefined')
        return null

    else
        return (
            <SWRConfig
                value={{
                    fetcher,
                    onErrorRetry(error, key, config, revalidate, { retryCount }) {
                        if (error.status === 404 || error.status === 429 ||
                            error.status === 500 || error.message === 'Unauthorized') return;
                        if (retryCount >= 5)
                            return;

                        setTimeout(() => revalidate({ retryCount }), 5000);
                    },
                    revalidateOnFocus: false,
                    revalidateOnReconnect: false,
                    revalidateIfStale: false
                }}
            >

                <AuthProviders>
                    <ThemeProviders>
                            <ToasterContext />
                            {children}
                    </ThemeProviders>
                </AuthProviders>
            </SWRConfig>

        );
}