import { ClickJump } from "../game/ClickJump/ClickJump"
import { PointAndShoot } from "../game/PointAndShoot/PointAndShoot"

export const Game = () => {
    const game = localStorage.getItem("game")
    console.log(game);
    if (game === "pointandshoot") {
        return <PointAndShoot/>
    } else if (game === "clickjump") {
        return <ClickJump/>
    }
}