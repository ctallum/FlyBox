import React from "react";
import Item from "../types";
import UploadButton from "./UploadButton";

interface IProps {
    setHelpIsOpen: (open: boolean) => void,
    setReloadIsOpen: (open: boolean) => void,
    setDownloadIsOpen: (open: boolean) => void,
    setData: (data: Item[]) => void,
    setNumDays: (days: number) => void,
    setCurrId: (id: number) => void
}
function Header(props: IProps) {
    return <div className="header">
        <div className="brandeis_logo">
            <a href="https://www.brandeis.edu/" target="_blank">
                <img src="./images/brandeis_logo.svg" alt="" />
            </a>
        </div>
        <h1 className="site-title">Rosbash Lab FlyBox Test Creator</h1>

        <div className="action-buttons" id="action-buttons">
            <button
                type="button"
                onClick={() => props.setHelpIsOpen(true)}
                title="About"
            >
                <img src="./images/about.svg" alt="" />
            </button>
            <button
                type="button"
                onClick={() => props.setHelpIsOpen(true)}
                title="Settings"
            >
                <img src="./images/settings.svg" alt="" />
            </button>
            <button
                type="button"
                onClick={() => props.setReloadIsOpen(true)}
                name="Reset"
                title="Reset all test data"
            >
                <img src="./images/reset_symbol.svg" alt="" />
            </button>
            <UploadButton setData={props.setData} setNumDays={props.setNumDays} setCurrId={props.setCurrId} />
            <button onClick={() => props.setDownloadIsOpen(true)} type="button" name="Download">
                Download test <img src="./images/download_symbol.svg" alt="" />
            </button>
        </div>
    </div>
}

export default Header;