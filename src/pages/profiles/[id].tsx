import { GetStaticPathsContext, NextPage } from 'next'
import Head from 'next/head'
import React from 'react'

export const id: NextPage = () => {
  return (
    <div>
        <Head>
            <title>{`Profil Mockinbird de ${user.name}`}</title>
        </Head>
    </div>
  )
}

export async function getStaticProps(context: GetStaticPathsContext<{id: string}) {
    const id = context.params.id
    if (id == null) {
        return {
            redirect: {
                destination: "/"
            }
        }
    }

    const ssg = ssgHelper()
    ssg.profile
}
