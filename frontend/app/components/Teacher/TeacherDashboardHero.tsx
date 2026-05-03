/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { FC } from 'react'
import TeacherDashboardHeader from "./TeacherDashboardHeader";
type Props = {}

const TeacherDashboardHero:FC<Props> = () => {
  return (
    <div>
        <TeacherDashboardHeader/>
    </div>
  )
}

export default TeacherDashboardHero;