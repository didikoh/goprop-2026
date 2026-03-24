
interface PerksProp {
    isHighlight: boolean;
    objs: any[];
}

export function PerksListing({ isHighlight, objs }: PerksProp) {
    return (
        <div className={(isHighlight) ? "project-Info__info5" : "project-Info__info6"}>
            <div className={(isHighlight) ? "project-Info__highlights" : "project-Info__facilities"}>
              <div className={(isHighlight) ? "project-Info__highlights-title" : "project-Info__facilities-title"}>
                <strong>{(isHighlight) ? 'Highlights' : 'Facilities'}</strong>
              </div>
              {objs.map((obj: any, index: number) => (
                <div className={(isHighlight) ? "project-Info__highlights-list" : "project-Info__facilities-list"} key={index}>
                  <div className={(isHighlight) ? "project-Info__highlights-item" : "project-Info__facilities-item"}>
                    <img
                      className="project-Info__icon"
                      src={`./assets/individualmenu/${(isHighlight) ? 'hightlights' : 'facilities'}/${obj.icon}.svg`}
                      alt={obj.icon}
                    ></img>
                    <p>{obj.text}</p>
                  </div>
                </div>
              ))}
            </div>
        </div>
    );
}
