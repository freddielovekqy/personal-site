package com.personal.site.controller;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/hello")
public class HelloWorldController {

    private Logger logger = Logger.getLogger(HelloWorldController.class);

    @RequestMapping(value = {"/index"}, method = {RequestMethod.POST, RequestMethod.GET})
    public ModelAndView hello() {
        ModelAndView view = new ModelAndView("hello");
        logger.info("welcome my personal website");
        return view;
    }
}
