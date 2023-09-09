import styles from "./style.module.scss"
import { useState, useRef, useCallback } from "react"
import { createPortal } from "react-dom"

type Props = {
  open: boolean
  value: string
  onChange: (value: string) => void
  onClose: (value: string | null) => void
}

export function Prompt({
  open,
  value,
  onChange: onValueChange,
  onClose
}: Props) {
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(e.target.value)
  }, [onValueChange])
  const onOkClick = useCallback(() => {
    onClose(value)
  }, [value, onClose])
  const onCancelClick = useCallback(() => {
    onClose(null)
  }, [onClose])
  return createPortal((
    open && (
      <div className={styles.cover}>
        <div className={styles.frame}>
          <div>
            <input type="text" value={value} onChange={onChange} />
          </div>
          <div>
            <button onClick={onCancelClick}>CANCEL</button>
            <button onClick={onOkClick}>OK</button>
          </div>
        </div>
      </div>
    )
  ), document.body)
}

export function usePrompt() {
  const [open, setOpen] = useState<boolean>(false)
  const [value, setValue] = useState<string>("")
  const onCloseRef = useRef<(value: string | null) => void>()
  const onClose = useCallback((value: string | null) => {
    setOpen(false)
    if (onCloseRef.current) {
      onCloseRef.current(value)
    }
  }, [setOpen, onCloseRef])
  const onChange = (value: string) => {
    setValue(value)
  }
  return {
    open: async (value: string) => {
      setOpen(true)
      setValue(value)
      return new Promise<string|null>((resolve) => {
        onCloseRef.current = (value: string | null) => {
          resolve(value)
        }
      })
    },
    elem: (
      <Prompt open={open} value={value} onClose={onClose} onChange={onChange}/>
    )
  }
}