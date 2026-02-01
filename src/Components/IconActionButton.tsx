interface IconActionButtonProps {
  icon: string
  iconSelected: string
  selected: boolean
  busy: boolean
  title?: string
  onClick?: () => void
  disabled?: boolean
}

function IconActionButton(props: IconActionButtonProps) {
  return (
    <>
      {props.busy && (
        <span>
          <span className="icon-spin1 animate-spin"></span>
        </span>
      )}
      {!props.busy && (
        <button
          onClick={() => {
            props.onClick?.()
          }}
          className={'icon-action-button' + (props.selected ? ' selected' : '')}
          title={props.title}
          disabled={props.disabled}
        >
          <span className={props.iconSelected}></span>
          <span className={props.icon}></span>
        </button>
      )}
    </>
  )
}

export default IconActionButton
