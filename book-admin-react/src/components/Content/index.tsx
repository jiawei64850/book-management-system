import { ReactNode } from 'react';
import styles from './index.module.css'

const Content = ({ 
  children, 
  title, 
  operation 
} : {
  children: ReactNode,
  title: string,
  operation? : ReactNode
}) => {
  return (
    <>
      <div className={styles.title}>
        {title}
        <span className={styles.btn}>{operation}</span>
      </div>
      <div className={styles.content}>{children}</div>
    </>
  )
}

export default Content;