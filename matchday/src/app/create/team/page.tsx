'use client'
import Empty from '@/src/components/empty'
import React from 'react'
import styles from './page.module.css'
import { Button, Input } from '@/src/design'

export default async function CreateMatchDay() {
    return (
        <div>
            <Input placeholder="Time" name="Time" type="number" />
            <Input placeholder="Time" name="Time" type="number" />
            <Button title="Share" />
        </div>
    )
}
