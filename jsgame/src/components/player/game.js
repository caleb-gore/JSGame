import { ClickJump } from "../game/ClickJump/ClickJump"
import { PointAndShoot } from "../game/PointAndShoot/PointAndShoot"
import { SideScroll } from "../game/sideScroll/sideScroll";

export const Game = () => {
    const game = localStorage.getItem("game")
    console.log(game);
    if (game === "pointandshoot") {
        return <PointAndShoot/>
    } else if (game === "clickjump") {
        return <ClickJump/>
    } else if (game === "sidescroll") {
        return <SideScroll />
    }
}