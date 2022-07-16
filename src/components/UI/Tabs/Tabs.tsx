import { FC, Fragment, ReactNode } from "react";

type TabType = {
    name: string;
    el: ReactNode;
}

type TabsProps = {
    tabs: Array<TabType>
    activeTabIndex: number
    onToggleTab: (tabIndex: number) => void
    children?: never
}

const Tabs: FC<TabsProps> = ({tabs, activeTabIndex, onToggleTab}: TabsProps) => {
    return (
        <Fragment>
            <ul className="nav nav-tabs" role="tablist">
                { 
                    tabs.map((tab, index) => {
                        return (
                            <li className="nav-item" role="presentation" key={index}>
                                <button className={`nav-link ${activeTabIndex === index ? "active" : ""}`} type="button" onClick={() => onToggleTab(index)}>{tab.name}</button> 
                            </li>
                        )
                    }) 
                }
            </ul>
            <div className="tab-content">
                {
                    tabs.map((tab, index) => {
                        return (
                            <div className={`tab-pane fade ${activeTabIndex === index ? "active show" : ""}`} key={`${index}-${tab.name}`}>
                                {tab.el}
                            </div>
                        )
                    }) 
                }
            </div>
        </Fragment>
    )
}

export default Tabs;