
interface ActionButtonProp {
    key: string;
    item: any;
}

export function ActionButton({ key, item }: ActionButtonProp) {
    return (
        <div className="project-Info__action-item" key={key}>
            <button
            className="project-Info__icon-container"
            onClick={item.onClick}
            disabled={item.disabled || false}
            >
                <img
                    className="project-Info__icon"
                    src={item.icon}
                    alt={`${item.label} Icon`}
                />
            </button>
            <p>{item.label}</p>
        </div>
    );
}

export function ActionButtonsContainer({ actionItems }: any) {
    return (
        <div className="project-Info__info2">
            <div className="project-Info__actions">
              {Object.entries(actionItems).map(([key, item]) => (
                <ActionButton key={key} item={item} />
              ))}
            </div>
        </div>
    );
}
