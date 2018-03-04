const Ease = require('dom-ease')

class Tooltip
{
    /**
     * Add tooltip to an element
     * @param {HTMLElement} element
     * @param {string} html
     * @param {object} [options]
     * @param {object} [options.styles] additional styles to apply to tooltip (e.g., backgroundColor: 'red')
     * @param {number} [options.parent] parent to attach tooltip div
     */
    constructor(element, html, options)
    {
        options = options || {}

        const styles = {}
        for (let style in Tooltip.styles)
        {
            styles[style] = Tooltip.styles[style]
        }
        if (options.styles)
        {
            for (let style in options.styles)
            {
                styles[style] = options.styles[style]
            }
        }
        this.display = styles['display'] || 'block'
        this.showing = false

        this.parent = options.parent || Tooltip.parent || document.body
        this.div = document.createElement('div')

        for (let style in styles)
        {
            this.div.style[style] = styles[style]
        }
        this.div.style.display = 'none'
        this.div.innerHTML = html

        element.addEventListener('mouseenter', (e) => this.mouseenter(e))
        element.addEventListener('mousemove', (e) => this.mousemove(e))
        element.addEventListener('mouseout', (e) => this.mouseout(e))

        this.parent.appendChild(this.div)
    }

    /** removes tooltip */
    remove()
    {
        this.parent.removeChild(this.div)
        this.div = null
    }

    /**
     * @type {string}
     * gets/sets change html of tooltip
     */
    get html()
    {
        return this.div.innerHTML
    }
    set html(value)
    {
        this.div.innerHTML = value
    }

    /**
     * @type {number}
     * get/set fade in/out duration in milliseconds
     */
    static get animationDuration()
    {
        return Tooltip.ease.options.duration
    }
    static set animationDuration(value)
    {
        Tooltip.ease.options.duration = value
    }

    /**
     * @type {(string|function)}
     * get/set ease function (or function name) to use for tooltip fade
     * defaults to 'easeInOutSine'
     */
    static get animationEase()
    {
        return Tooltip.ease.options.ease
    }
    static set animationEase(value)
    {
        Tooltip.ease.options.ease = value
    }

    position(e)
    {
        if (e.clientX > window.innerWidth / 2)
        {
            this.div.style.left = 'unset'
            this.div.style.right = window.innerWidth - e.clientX + 'px'
        }
        else
        {
            this.div.style.right = 'unset'
            this.div.style.left = e.clientX + 'px'
        }
        if (e.clientY < window.innerHeight / 2)
        {
            this.div.style.bottom = 'unset'
            this.div.style.top = e.clientY + 'px'
        }
        else
        {
            this.div.style.top = 'unset'
            this.div.style.bottom = window.innerHeight - e.clientY + 'px'
        }
    }

    mouseenter(e)
    {
        if (!this.div)
        {
            return
        }
        if (e.buttons === 0)
        {
            if (!this.showing)
            {
                this.div.style.opacity = 0
                this.div.style.display = this.display
                Tooltip.ease.remove(this.easing)
                this.easing = Tooltip.ease.add(this.div, { opacity: 1 }, { wait: Tooltip.wait })
                this.position(e)
                this.showing = true
            }
        }
    }

    mousemove(e)
    {
        if (this.div && this.showing)
        {
            this.position(e)
        }
    }

    mouseout()
    {
        if (this.div && this.showing)
        {
            this.showing = false
            Tooltip.ease.remove(this.easing)
            this.easing = Tooltip.ease.add(this.div, { opacity: 0 })
            this.easing.on('complete', () =>
            {
                this.div.style.display = 'none'
            })
        }
    }
}

/**
 * @type {object}
 * default styles to apply to tooltip div
 */
Tooltip.styles = {
    'position': 'absolute',
    'zIndex': 99999,
    'background': 'white',
    'border': 'solid black 1px',
    'padding': '0.75em',
    'pointerEvents': 'none'
}

Tooltip.ease = new Ease({ duration: 250, ease: 'easeInOutSine' })

/**
 * @type {number}
 * @static
 * milliseconds to wait before showing tooltip
 */
Tooltip.wait = 500

/**
 * @type {HTMLElement}
 * element to attach div
 */
Tooltip.parent = document.body

module.exports = Tooltip